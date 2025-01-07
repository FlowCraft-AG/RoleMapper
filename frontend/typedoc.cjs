/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    // out: '../.extras/doc/api',
    out: '../docs/frontend',
    entryPoints: ['src'],
    entryPointStrategy: 'expand',
    excludeExternals: true,
    excludePrivate: true,
    theme: 'default',
    validation: {
        invalidLink: true,
    },
    name: 'RoleMapper Frontend API Documentation',
    readme: '../README.md',
};
