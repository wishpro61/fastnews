function openMenu() {
  document.getElementById("menu").style.display = "block";
}

function hideAd() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("mainAd").style.display = "none";
  document.getElementById("thanks").style.display = "block";
}

function feedback() {
  hideAd();
}

function showAd() {
  document.getElementById("mainAd").style.display = "flex";
  document.getElementById("menu").style.display = "none";
  document.getElementById("thanks").style.display = "none";
}

function openWhyAd() {
  window.open("https://adssettings.google.com/whythisad", "_blank");
}
