const EventEmitter = require("events");

class GetModalBody extends EventEmitter {
  command(gistId, callback) {
    this.api
      .switchFile(`browser/gists/${gistId}`)
      .waitForElementVisible(`li[key^='browser/gists/${gistId}/']`)
      .elements(
        "css selector",
        `li[key^='browser/gists/${gistId}/']`,
        result => {
          console.log(result);
          callback(result.value, () => {
            this.emit("complete");
          });
        }
      );

    return this;
  }
}

module.exports = GetModalBody;
