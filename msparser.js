var msParser = (function () {
  function MsParser() {}

  MsParser.prototype = {
    parse: function (obj) {
      return new Promise(function (resolve, reject) {
        try {
          var re = /^https?:\/\/.*\/(.*)\.mp3$/;
          var m = obj.url.match(re);

          let fmt = {
            url: obj.url,
            ext: "mp3",
            protocol: "https",
            audio_ext: "mp3",
            format: "mp3",
            httpHeaders: {
              Referer: "https://fantbox.net/",
            },
          };

          let result = {
            title: m[1],
            webpage_url: obj.url,
            formats: [fmt],
          };

          resolve(result);
        } catch (e) {
          reject({ error: e.message, isParseError: true });
        }
      });
    },

    isSupportedSource: function (url) {
      return /^https?:\/\/.*\/.*\.mp3$/.test(url);
    },

    supportedSourceCheckPriority: function () {
      return 65535;
    },

    isPossiblySupportedSource: function (obj) {
      return false;
    },

    minIntevalBetweenQueryInfoDownloads: function () {
      return 300;
    },
  };

  return new MsParser();
})();
