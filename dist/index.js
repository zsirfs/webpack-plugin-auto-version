"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var os=require("os"),path=_interopDefault(require("path")),fs=_interopDefault(require("fs")),yargs=_interopDefault(require("yargs")),semver=_interopDefault(require("semver")),rimraf=_interopDefault(require("rimraf")),notifier=_interopDefault(require("node-notifier")),htmlWebpackPluginBeforeHtmlGeneration=function(e){var n=e.filenameMark;return function(i,t){var r=i.assets,s=r.publicPath,o=r.js,a=void 0===o?[]:o,c=r.css,l=void 0===c?[]:c,u=s?"/"+e.newVersion:e.newVersion+"/";i.assets.js=a.map(function(i){var t=""+u+i;return-1!==i.indexOf(e.newVersion)?i:n?t.replace(n,e.newVersion):t}),i.assets.css=l.map(function(i){var t=""+u+i;return-1!==i.indexOf(e.newVersion)?i:n?t.replace(n,e.newVersion):t}),t(null,i)}},htmlWebpackPluginAfterHtmlProcessing=function(e){var n=e.inspectContent;return function(i,t){if(n){var r="\x3c!-- "+e.banner+" --\x3e";i.html=r+os.EOL+i.html}t(null,i)}},htmlWebpackPluginAlterAssetTags=function(){return function(e,n){return n(null,e)}};function injectCssBanner(e,n){var i="/**  "+n+"   */"+os.EOL+e.source();e.source=function(){return i}}function injectHtmlBanner(e,n){var i="\x3c!--  "+n+"   --\x3e";if(!e.source().toString().startsWith("\x3c!--")){var t=i+os.EOL+e.source();e.source=function(){return t}}}function injectJsBanner(e,n){var i="/**  "+n+" */"+os.EOL+e.source();e.source=function(){return i}}function injectVersionByTemp(e,n,i){var t=e.source();"string"==typeof t&&(e.source=function(){return t.replace(n,i)})}var classCallCheck=function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")},WebpackAutoVersionPlugin=function e(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};classCallCheck(this,e),_initialiseProps.call(this),this.filenameMark=n.filenameMark,this.copyright=n.copyright||"[webpack-plugin-auto-version]",this.pkgPath="",this.pkg="",this.space=n.space||2,this.cleanup=n.cleanup||!1,this.inspectContent=n.inspectContent||!0,this.template=n.template||"["+this.copyright+"]version[/"+this.copyright+"]",this.ignoreSuffix=n.ignoreSuffix||[".html"],this.isAsyncJs=n.isAsyncJs,this.htmlTempSuffix=[".html",".vm",".ejs",".handlbars"].concat(n.htmlTempSuffix||[])},_initialiseProps=function(){var e=this;this.init=function(){e.pkgPath=e.webpackConfig.context+"/package.json",e.pkg=e.readJsonFile(e.pkgPath),e.fixPackageFile(),e.autoIncreaseVersion(),e.banner=e.copyright+" "+e.newVersion+"   "+(new Date).toLocaleString()},this.fixPackageFile=function(){e.pkg.version||(e.pkg.version="0.0.1")},this.readJsonFile=function(e){var n=fs.readFileSync(e);return JSON.parse(n)},this.cleanupOldVersion=function(){if(e.cleanup){var n=e.webpackConfig.output.path;fs.readdirSync(n).filter(function(e){return fs.statSync(n+"/"+e).isDirectory}).forEach(function(i){semver.valid(i)&&semver.lt(i,e.pkg.version)&&rimraf(n+"/"+i,function(e){notifier.notify({title:"清除旧版本出错",message:e.message})})})}},this.autoIncreaseVersion=function(){var n=yargs.argv._,i=e.pkg.version,t=-1!==n.indexOf("minor"),r=-1!==n.indexOf("major");return t?(e.newVersion=semver.inc(i,"minor"),void(e.pkg.version=e.newVersion)):r?(e.newVersion=semver.inc(i,"major"),void(e.pkg.version=e.newVersion)):(e.newVersion=semver.inc(i,"patch"),void(e.pkg.version=e.newVersion))},this.persistVersion=function(){var n=JSON.stringify(e.pkg,null,e.space);fs.writeFileSync(e.pkgPath,n)},this.replaceVersionTag=function(n){return e.filenameMark?n.replace(e.filenameMark,"v"+e.pkg.version):n},this.resetOptions=function(n){e.isAsyncJs&&(n.output=Object.assign(n.output,{publicPath:"/"+e.newVersion+"/"}))},this.apply=function(n){e.webpackConfig=n.options,e.init(),e.resetOptions(n.options);var i=e.pkg.version,t=e,r=t.webpackConfig.output;n.plugin("emit",function(e,n){var s={};Object.keys(e.assets).forEach(function(n){var o=path.extname(n),a=e.assets[n];injectVersionByTemp(a,t.template,t.newVersion);var c=t.replaceVersionTag(n),l=t.ignoreSuffix.find(function(e){return-1!==n.indexOf(e)});switch(o){case".js":l?s[c]=a:s[i+"/"+c]=a,injectJsBanner(a,t.banner);break;case".css":l?s[c]=a:s[i+"/"+c]=a,injectCssBanner(a,t.banner);break;default:-1!==t.ignoreSuffix.concat(t.htmlTempSuffix).indexOf(o)||-1!==n.indexOf(r)||l?(s[c]=a,-1!==t.htmlTempSuffix.indexOf(o)&&injectHtmlBanner(a,t.banner)):s[i+"/"+c]=a}}),e.assets=s,t.filenameMark&&e.chunks.forEach(function(e){e.files=e.files.filter(function(e){return".html"!==path.extname(e)}).map(function(e){return i+"/"+t.replaceVersionTag(e)}).concat(e.files.filter(function(e){return".html"===path.extname(e)}))}),n()}),n.plugin("failed",function(e){console.error("fail"),notifier.notify({title:"WebpackAutoVersionPlugin",message:e.message})}),n.plugin("done",function(){t.cleanupOldVersion(),t.persistVersion()}),n.hooks?n.hooks.compilation.tap("WebpackAutoVersionPlugin",function(n){n.hooks.htmlWebpackPluginBeforeHtmlGeneration&&n.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync("WebpackAutoVersionPlugin",htmlWebpackPluginBeforeHtmlGeneration(e)),n.hooks.htmlWebpackPluginAlterAssetTags&&n.hooks.htmlWebpackPluginAlterAssetTags.tapAsync("WebpackAutoVersionPlugin",htmlWebpackPluginAlterAssetTags(e)),n.hooks.htmlWebpackPluginAfterHtmlProcessing&&n.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync("WebpackAutoVersionPlugin",htmlWebpackPluginAfterHtmlProcessing(e))}):n.plugin("compilation",function(n){n.plugin("html-webpack-plugin-before-html-generation",htmlWebpackPluginBeforeHtmlGeneration(e)),n.plugin("html-webpack-plugin-alter-asset-tags",htmlWebpackPluginAlterAssetTags(e)),n.plugin("html-webpack-plugin-after-html-processing",htmlWebpackPluginAfterHtmlProcessing(e))})}};module.exports=WebpackAutoVersionPlugin;
