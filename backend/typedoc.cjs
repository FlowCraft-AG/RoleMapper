/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    // out: '../.extras/doc/api',
    out: '../docs/backend',
    entryPoints: ['src'],
    includeVersion: true,
    entryPointStrategy: 'expand',
    excludeExternals: true,
    excludePrivate: true,
    theme: 'default',
    validation: {
        invalidLink: true,
    },
    name: 'RoleMapper Backend API Documentation',
    readme: '../README.md',
};
