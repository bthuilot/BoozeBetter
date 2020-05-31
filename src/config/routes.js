function setRoutes(controllers, app) {
  // Have each controller regiester routes
  controllers.forEach((controller) => controller.registerRoutes(app));
}

module.exports = { setRoutes };
