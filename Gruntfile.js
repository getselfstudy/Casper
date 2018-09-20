/* eslint-env node */
/* eslint-disable object-shorthand */
'use strict';

module.exports = function (grunt) {
    console.log("Init");
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(prod => {
        console.log(prod);
        grunt.loadNpmTasks(prod);
    });

    grunt.initConfig({
        clean: {
            built: {
                src: [
                    'dist/**',
                    'components/build',
                    'components/node_modules'
                ]
            },
            dependencies: {
                src: ['node_modules/**']
            }
        },

        shell: {
            'npm-install': {
                command: 'cd components && yarn install'
            },

            'npm-prod': {
                command: 'npm run build'
            },


            'npm-clean': {
                command: 'rm -rf components/node_modules'
            }
        }
    });

    grunt.registerTask('npm-prod', 'Install the client dependencies',
        ['shell:npm-install', 'shell:npm-prod']
    );

    grunt.registerTask('init', 'Install the client dependencies',
        ['shell:npm-install']
    );
};
