const styleSchema = require('../../../config/styleSchema.js').default;

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Column Section',
  controls: {
    position: 'bottom-left'
  },
  addFields: [
    {
      name: 'backgroundColor',
      type: 'color',
      label: 'Background color',
    },
    {
      name: 'backgroundImage',
      type: 'attachment',
      label: 'Background image',
      svgImages: true,
      trash: true
    },
    {
      name: 'displayType',
      label: 'Columns',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Full page width ',
          value: 'full-width',
        },
        {
          label: 'One column: 100%',
          value: 'columns-one',
        },
        {
          label: 'Two Columns: 50% - 50%',
          value: 'columns-half',
        },
        {
          label: 'Two Columns: 33% - 66%',
          value: 'columns-onethird',
        },
        {
          label: 'Two Columns: 66% - 33%',
          value: 'columns-twothird-onethird',
        },
        {
          label: 'Two Columns: 75% - 25%',
          value: 'columns-twothird-full',
        },
        {
          label: 'Two Columns: 25% - 75%',
          value: 'columns-onefourth',
        },
        {
          label: 'Two Columns: Desktop: 75% - 25%, Tablet:  66% - 33%',
          value: 'columns-twothird',
        },
        {
          label: 'Three Columns: 25% - 50% - 25%',
          value: 'columns-onefourth-half',
        },
        {
          label: 'Three columns: 33% - 33% - 33%',
          value: 'columns-three',
        },
        {
          label: 'Four Columns: 25% - 25% - 25% - 25%',
          value: 'columns-four',
        },
        {
          label: 'Full screen (vertical & horizontal)',
          value: 'full-screen',
        },


      /*  {
          label: 'icons',
          value: 'icons',
        }, */
      ]
    },
    {
      name: 'area1',
      type: 'area',
      label: 'Area 1',
      contextual: true
    },
    {
      name: 'area2',
      type: 'area',
      label: 'Area 2',
      contextual: true
    },
    {
      name: 'area3',
      type: 'area',
      label: 'Area 3',
      contextual: true
    },
    {
      name: 'area4',
      type: 'area',
      label: 'Area 4',
      contextual: true
    },
    styleSchema.definition('containerStyles', 'Styles for the container'),
    {
      name: 'marginType',
      label: 'Margin type',
      type: 'select',
      required: true,
      choices: [
        {
          label: 'Normal',
          value: 'normal'
        },
        {
          label: 'Shift upwards',
          value: 'up'
        }
      ]
    },
    {
      name: 'htmlId',
      type: 'string',
      label: 'HTML ID',
    },
    {
      name: 'htmlClass',
      type: 'string',
      label: 'HTML Class',
    },
    {
      type: 'boolean',
      name: 'sectionToggle',
      default: true,
      label: 'Show section as toggle section',
      choices: [
        {
          value: true,
          label: "Yes",
          showFields: [
            'sectionOpen', 'mobileToggle', 'toggleTitle'
          ]
        },
        {
          value: false,
          label: "No"
        },
      ]
    },
    {
      name: 'toggleTitle',
      type: 'string',
      label: 'Toggle title',
    },
    {
      type: 'boolean',
      name: 'sectionOpen',
      default: true,
      label: 'Section open by default?',
      choices: [
        {
          value: true,
          label: "Open"
        },
        {
          value: false,
          label: "closed"
        },
      ]
    },
    {
      type: 'boolean',
      name: 'mobileToggle',
      default: true,
      label: 'Show toggle only on mobile',
      choices: [
        {
          value: true,
          label: "Yes"
        },
        {
          value: false,
          label: "No"
        },
      ]
    },

  ],

  construct: function(self, options) {
    const superPushAssets = self.pushAssets;
    self.pushAssets = function () {
      superPushAssets();
      self.pushAsset('stylesheet', 'main', { when: 'always' });
    };

    const superLoad = self.load;

    self.load = function (req, widgets, callback) {
      return superLoad(req, widgets, function (err) {
        if (err) {
          return callback(err);
        }

        widgets.forEach((widget) => {
          if (widget.containerStyles) {
            const containerId = styleSchema.generateId();
            widget.containerId = containerId;
            widget.formattedContainerStyles = styleSchema.format(containerId, widget.containerStyles);
          }
        });
        return callback(null);
      });
    };

  }
};