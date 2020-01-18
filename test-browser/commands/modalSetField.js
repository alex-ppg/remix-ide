const EventEmitter = require("events");

class ModalSetField extends EventEmitter {
  command(value) {
    this.api.waitForElementVisible("#prompt_text").perform((client, done) => {
      this.api.execute(
        function() {
          document.querySelector("#prompt_text").value = value;
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

module.exports = ModalSetField;
