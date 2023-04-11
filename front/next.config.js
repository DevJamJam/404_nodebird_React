const withBundleAnalyzer  = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
    compress: true,
    webpack(config, {webpack}) {
        const prod = process.env.NODE_ENV = 'production';
        return {
            ...config,
            mode: prod ? 'production' : 'development',
            devtool: prod ? 'hidden-source-map' : 'eval', 
            //hidden-source-map 안하면 배포환경에서 소스코드 다 노출 된다. 
            plugins: [
                ...config.plugins,
                new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
            ],
        }
    },
})