const puppeteer = require("puppeteer");
const userFactory = require("../factories/user.factory");
const sessionFactory = require("../factories/session.factory");

class CustomPage {
  constructor(page) {
    this.page = page;
  }

  static async build() {
    const brower = await puppeteer.launch({
      headless: true,
      arguments: ["--no-sandbox"],
    });
    const page = await brower.newPage();
    const customPage = new this(page);

    return new Proxy(customPage, {
      get: (target, property) => {
        return customPage[property] || brower[property] || page[property];
      },
    });
  }

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto("http://localhost:3000/blogs");
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return this.page.$eval(selector, (el) => el.innerHTML);
  }

  get(path, data) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
    }, path);
  }

  post(path, data) {
    return this.page.evaluate(
      (_path, _data) => {
        return fetch(_path, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(_data),
        }).then((res) => res.json());
      },
      path,
      data
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
