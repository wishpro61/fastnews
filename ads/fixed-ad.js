<script>
function openAdMenu() {
  toggleBox("adMenu", "adInfo");
}

function openAdInfo() {
  toggleBox("adInfo", "adMenu");
}

function toggleBox(showId, hideId) {
  const show = document.getElementById(showId);
  const hide = document.getElementById(hideId);

  show.style.display = show.style.display === "block" ? "none" : "block";
  hide.style.display = "none";
}
</script>
