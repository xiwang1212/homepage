"use strict";

function main() {

  var sceneController = new SceneController();
  sceneController.setup();

  var htmlController = new HtmlController(sceneController);
  htmlController.setup();
}
