/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    // out: '../.extras/doc/api',
    out: '../docs/backend',
    entryPoints: ['src'],
    includeVersion: true,
    plugin: ['typedoc-plugin-markdown'],
    entryPointStrategy: 'expand',
    excludeExternals: true,
    excludePrivate: true,
    // theme: 'default',
    theme: 'markdown',
    validation: {
        invalidLink: true,
    },
    name: 'RoleMapper Backend API Documentation',
    readme: '../README.md',
};
