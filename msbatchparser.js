/* Parse playlists */

var msBatchVideoParser = (function () {
  function MsBatchVideoParser() {}

  MsBatchVideoParser.prototype = {
    parse: function (obj) {
      return downloadUrlAsUtf8Text(obj.url, obj.cookie).then(this.parseContent);
    },

    parseContent: function (obj) {
      return new Promise(function (resolve, reject) {
        try {
          var rePlaylist =
            /<input\s+[^>]*\bid\s*=\s*["']?dap-playlist-source["']?[^>]*\bvalue\s*=\s*["']([^"']+)["'][^>]*>/;
          var m = obj.body.match(rePlaylist);
          var playList = m[1];

          var rePlaylistTitle =
            /<h3\s+[^>]*\bid\s*=\s*["']?dap-book-title["']?[^>]*>([^<]+)/;
          var m = obj.body.match(rePlaylistTitle);
          var playlistTitle = m[1];

          var entries = [];
          var p = downloadUrlAsUtf8Text(playList)
            .then(function (obj) {
              return new Promise(function (innerResolve, innerReject) {
                try {
                  let chapters = JSON.parse(obj.body);
                  chapters.forEach((element) => {
                    entries.push({
                      _type: "url",
                      url: element.file,
                      title: element.title,
                    });
                  });

                  let result = {
                    _type: "playlist",
                    title: playlistTitle,
                    webpage_url: playList,
                    entries: entries,
                  };

                  resolve(result);
                } catch (e) {
                  innerReject({ error: e.message, isParseError: true });
                }
              });
            })
            .catch(function (e) {
              reject({ error: e.message, isParseError: true });
            });
        } catch (e) {
          reject({ error: e.message, isParseError: true });
        }
      });
    },

    isSupportedSource: function (url) {
      return /^https?:\/\/fantbox.net\/.*\/.*\.html$/.test(url);
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

  return new MsBatchVideoParser();
})();
