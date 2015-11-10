var path = require("path")
var _ = require('lodash')

module.exports = function(plasma, dna){
  this.plasma = plasma
  this.dna = dna
  this.templateCache = {}

  var self = this
  plasma.on(dna.reactOn || "renderEmail", function (email, next) {
    self.renderEmail(email, function (err, renderedEmail) {
      if (dna.emitEmail) {
        renderedEmail = _.extend({}, renderedEmail, {
          type: dna.emitEmail
        })
        if (dna.syncWithEmailEmit) { // wait dna.emitEmail callback
          return plasma.emit(renderedEmail, next)
        }
        plasma.emit(renderedEmail) // just fire and forget
      }
      next(err, renderedEmail) // reaction complete callback
    })
  })
}

module.exports.prototype.renderEmail = function (email, done) {
  this.loadTemplate(email, function (err, template) {
    if (err) return done(err)
    template.render(email.data, function (err, results) {
      if (err) return done(err)
      email.html = results.html
      email.text = results.text
      done(null, email)
    })
  })
}

module.exports.prototype.loadTemplate = function(email, done) {
  var templateCacheKey = email.template
  var template = this.templateCache[templateCacheKey]

  // return cached template
  if(template)
    return done(null, template)

  var root = ""
  if(this.dna.root && !pathIsFull(this.dna.root))
    root = path.join(process.cwd(), this.dna.root)
  else if(this.dna.root)
    root = this.dna.root

  var targetTemplate = path.join(root, email.template)

  var templateEnginePath = this.dna.templateEngine
  if (!pathIsFull(templateEnginePath))
    templateEnginePath = path.join(process.cwd(), templateEnginePath)

  var Renderer = require(templateEnginePath)(this.dna.templateEngineOptions)
  template = new Renderer(targetTemplate)
  if (this.dna.cache)
    this.templateCache[templateCacheKey] = template

  done(null, template)
}

var pathIsFull = function (value) {
  return value.indexOf("/") === 0 || value.indexOf(":\\")===1
}
