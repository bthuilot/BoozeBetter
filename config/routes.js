function setRoutes(controllers, app) {
  // Have each controller regiester routes
  controllers.forEach((controller) => controller.registerRoutes(app));

  // Route all unknown requests to react
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/frontend/build/index.html"));
  });
}
