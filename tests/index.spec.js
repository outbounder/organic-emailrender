describe("index", function () {
  var Plasma = require("organic-plasma")
  var EmailSender = require("../index")

  it("renders email", function (next) {
    var plasma = new Plasma()
    var instance = new EmailSender(plasma, {
      root: __dirname + '/data',
      templateEngine: "email-templates"
    })
    plasma.emit({
      type: "renderEmail",
      subject: "test",
      template: "email-template",
      data: {
        testValue: "value"
      }
    }, function (err, email) {
      expect(err).toBeFalsy()
      expect(email.html).toContain("html")
      expect(email.html).toContain("value")
      next()
    })
  })
})
