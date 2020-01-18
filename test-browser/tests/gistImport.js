"use strict";
const init = require("../helpers/init");
const sauce = require("./sauce");
const request = require("request");

module.exports = {
  before: function(browser, done) {
    init(browser, done);
  },
  ImportFromGist: function(browser) {
    /*
       - Click import from Gist
       - Type Gist URL / ID to input field
       - Ensure it exists
      */

    // RegExp below is valid for both gist.github.com/_id_ and gist.github.com/github_username/_id_ URLs
    const idRegex = /gist\.github\.com\/(.*\/)?(.*)/gm;
    const [_, ghUsername, gistId = ghUsername] = idRegex.exec(
      process.env.sample_gist
    );

    browser
      .clickImport("Gist")
      .modalSetField(process.env.sample_gist)
      .modalFooterOKClick()
      .clickLaunchIcon("fileExplorers")
      .getGistContents(gistId, (contents, done) => {
        console.log(contents);
        request.get(
          {
            url: `https://api.github.com/gists/${gistId}`,
            headers: {
              "User-Agent": "Remix IDE Test",
              Accept: "application/vnd.github.v3+json"
            }
          },
          function(error, response, body) {
            if (error)
              browser.assert.fail(
                "Invalid Gist provided in ENV variable",
                "",
                ""
              );

            body = JSON.parse(body);

            let localChain = browser;

            const fileNames = Object.keys(body.files);

            fileNames.forEach(fileName => {
              localChain = localChain.waitForElementVisible(
                `li[key='browser/gists/${gistId}/${fileName}']`
              );
            });

            localChain
              .switchFile(`li[key='browser/gists/${gistId}/${fileNames[0]}']`)
              .testEditorValue(body.files[fileNames[0]].content)
              .perform(done);
          }
        );
      })
      .end();
  },
  tearDown: sauce
};
