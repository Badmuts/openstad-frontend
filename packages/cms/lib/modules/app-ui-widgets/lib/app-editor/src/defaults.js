
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1)

const defaultResources = [
  {
    apiBase: 'https://reqres.in/api/', // if empty fetch from default settings
    apiPath: 'game',
    responseKey: 'data',
    name: 'games',
    nameSingle: 'game',
    namePlural: 'games',
    defaultComponents: [
      {
        type: 'title',
        resource: true,
        keyTitle: 'title'
      },
      {
        type: 'game',
        resource: true,
        props: {

        }
      }
    ]
  },
  {
    apiUrl: '', // if empty fetch from default settings
    name: 'article',
    nameSingle: 'article',
    namePlural: 'articles',
    defaultComponents: [
      {
        type: 'title',
        props: {
          keyTitle: 'title'
        }
      },
      {
        type: 'images',
        multiple: false,
        props: {
          keyImage: 'src'
        }
      },
      {
        type: 'richText',
        props: {
          key: 'content'
        }
      },
    ]
  },
  {
    apiUrl: '', // if empty fetch from default settings
    name: 'article',
    nameSingle: 'article',
    namePlural: 'articles',
    defaultComponents: [
      {
        type: 'title',
        props: {
          key: 'title'
        }
      },
      {
        type: 'images',
        props: {
          key: 'src'
        }
      },
      {
        type: 'richText',
        props: {
          key: 'content'
        }
      },
    ]
  },
  {
    apiUrl: '', // if empty fetch from default settings
    name: 'product',
    nameSingle: 'product',
    namePlural: 'products',
    defaultComponents: [
      {
        type: 'title',
        props: {
          key: 'title'
        }
      },
      {
        type: 'richText',
        props: {
          key: 'price'
        }
      },
      {
        type: 'images',
        props: {
          key: 'src'
        }
      },
    ]
  }
];

const defaultSettings = {

}

const defaultNavigation = {

}

const defaultResourceScreens = defaultResources.map((resource, i) => {
  return {
    id : 100000 + i,
    type: 'resource',
    name: `${capitalize(resource.nameSingle)} screen`,
    components: resource.defaultComponents
  }
});

const defaultScreens = {
  startScreenId: 1,
  items: [
    {
      id: 1,
      name: 'Start page',
      type: 'static',
      components: [
        {
          type: 'title',
          props: {
            title: 'All games'
          }
        },
        {
          type: 'overview',
          props: {
            resource: 'game',
            amount: 12,
            titleKey: 'title',
            imageKey: 'image'
          }
        },

      ]
    },
    {...defaultResourceScreens}
  ],
}

exports.appResource = {
  id: 1,
  title: 'New app...',
  revisions: [{
    resources: {
      items: defaultResources,
    },
    settings: defaultSettings,
    navigationSettings: defaultNavigation,
    screens: defaultScreens
  }],
};
