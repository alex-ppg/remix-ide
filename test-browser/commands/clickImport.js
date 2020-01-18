const EventEmitter = require("events");

class ClickImport extends EventEmitter {
  command(btn) {
    this.api
      .waitForElementVisible("#col1 > .file > .btn-group")
      .perform((client, done) => {
        this.api.execute(
          function() {
            const btns = document.querySelectorAll(
              "#col1 > .file > .btn-group > button"
            );

            for (let i = 0; i < btns.length; i++) {
              if (btns[i].innerText === btn) return btns[i].click();
            }
          },
          [],
          result => {
            done();
            this.emit("complete");
          }
        );
      });
    return this;
  }
}

module.exports = ClickImport;
