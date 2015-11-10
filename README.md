# organic-emailrender v0.1.0

A simple email render supporting.

## `dna`

    {
      "reactOn": String,
      "root": String,
      "templateEngine": String,
      "cache": Boolean, default false,
      "emitEmail": String, optional
      "syncWithEmailEmit": Boolean, optional, default false
    }

### `dna.reactOn` chemical, default `renderEmail`

    {
      template: String,
      data: Object,

      to: String, optional
      from: String, optional
      subject: String, optional
      ...
    }

### `dna.emitEmail` chemical

Re-emits `dna.reactOn` chemicals by adding new `type` value equal to `dna.emitEmail`, `html` and `text` fields of rendered `chemical.template`

    {
      type: "{dna.emitEmail}",
      html: String,
      text: String,

      // all properties provided in `dna.reactOn` like
      template: String,
      data: Object,
      to: String,
      from: String,
      subject: String,
      ...
    }

### `dna.templateEngine`

Can be a path to a module having interface:

    module.exports = function (emailTemplatePath) {
    }

    module.exports.prototype.render = function (templateData, handler) {
      // renderedTemplate = emailTemplatePath + templateData
      handler(err, {html: renderedTemplateHtml, text: renderedTemplateText})
    }

Or it can be [email-templates](https://github.com/niftylettuce/node-email-templates) module
