const rp = require('request-promise');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Arguments form',
  addFields: [
    {
      name: 'ideaId',
      type: 'string',
      label: 'Idea ID (add :ideaId for ideaId from url)',
      required: true
    },
    {
      name: 'placeholder',
      type: 'string',
      label: 'Placeholder',
      required: true
    },
    {
      name: 'sentiment',
      type: 'select',
      choices: [
        {
          label: 'Geen',
          value: '',
        },
        {
          label: 'Voor',
          value: 'for',
        },
        {
          label: 'Tegen',
          value: 'against',
        },
      ]
    },
  ],
  construct: function(self, options) {
     var superPushAssets = self.pushAssets;

     self.pushAssets = function() {
       superPushAssets();
       self.pushAsset('stylesheet', 'main', { when: 'always' });
       self.pushAsset('script', 'main', { when: 'always' });
     };

     self.route('post', 'submit', function(req, res) {
       //let auth = `Basic ${new Buffer("openstad:op3nstad#").toString("base64")}`//
       const apiUrl = self.apos.settings.getOption(req, 'apiUrl');
       const appUrl = self.apos.settings.getOption(req, 'appUrl');
       const siteId = req.data.global.siteId;
       const ideaId = req.body.ideaId;

       const options = {
          method: 'POST',
           uri:  apiUrl + `/api/site/${siteId}/idea/${ideaId}/argument`,
           headers: {
               'Accept': 'application/json',
               "X-Authorization" : ` Bearer ${req.session.jwt}`,
           },
           body: req.body,
           json: true // Automatically parses the JSON string in the response
       };

       console.log('submit options', options);

       rp(options)
         .then(function (response) {
            const redirectTo = req.header('Referer')  || appUrl
            res.redirect(redirectTo + '/#arg'+response.id);
         })
         .catch(function (err) {

            console.log('args err', err);
            res.redirect(req.header('Referer')  || appUrl);
         });

      // Access req.body here
      // Send back an AJAX response with `res.send()` as you normally do with Express
    });
  }
};