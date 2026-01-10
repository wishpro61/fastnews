function toggleOptions() {
  document.getElementById("adOptions").style.display =
    document.getElementById("adOptions").style.display === "block" ? "none" : "block";
  document.getElementById("adInfo").style.display = "none";
}

function toggleInfo() {
  document.getElementById("adInfo").style.display =
    document.getElementById("adInfo").style.display === "block" ? "none" : "block";
  document.getElementById("adOptions").style.display = "none";
}
