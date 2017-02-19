module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            development: {
                options: {
                    paths: ["/public/src/less"],
                    yuicompress: true
                },
                files: {
                    "public/css/style.css": "public/src/less/style.less"
                }
            }
        },
        watch: {
            files: "public/src/less/*",
            tasks: ["less"],
        }
    });
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
};