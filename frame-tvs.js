/* Animated TVs for the framed pages. Same art as the home page, 3 images per TV, cycling. */
(function () {
  var tvFiles = {
    tv1: ["skully.png", "climbingover.png", "endoftheword.png"],
    tv2: ["clown.png", "betterout.png", "charlie.png"],
    tv3: ["1.png", "2.png", "3.png"],
    tv4: ["1.png", "2.png", "3.png"]
  };
  var tvDirs = { tv1: "art/tv1-top/", tv2: "art/tv2-mid/", tv3: "art/tv3-bot1/", tv4: "art/tv4-bot2/" };
  var stagger = { tv1: 0, tv2: 200, tv3: 400, tv4: 600 };
  Object.keys(tvFiles).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var i = 0;
    tvFiles[id].forEach(function (f) { var im = new Image(); im.src = tvDirs[id] + f; });
    function next() {
      i = (i + 1) % tvFiles[id].length;
      el.src = tvDirs[id] + tvFiles[id][i];
      setTimeout(next, 500 + Math.random() * 900);
    }
    setTimeout(next, 500 + stagger[id]);
  });
  var mtvMap = { mtv1: "tv1", mtv2: "tv2", mtv3: "tv3", mtv4: "tv4" };
  var mtvDirs = { tv1: "art/tv-mobile/tv1-top/", tv2: "art/tv-mobile/tv2-mid/", tv3: "art/tv-mobile/tv3-bot1/", tv4: "art/tv-mobile/tv4-bot2/" };
  Object.keys(mtvMap).forEach(function (mtvId) {
    var deskId = mtvMap[mtvId];
    var wrap = document.getElementById(mtvId);
    if (!wrap) return;
    var img = wrap.querySelector("img");
    if (!img) return;
    var j = 0;
    function nextMobile() {
      j = (j + 1) % tvFiles[deskId].length;
      img.src = mtvDirs[deskId] + tvFiles[deskId][j];
      setTimeout(nextMobile, 500 + Math.random() * 900);
    }
    setTimeout(nextMobile, 500 + stagger[deskId]);
  });
})();
