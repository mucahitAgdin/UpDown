document.getElementById("btn-computers").addEventListener("click", function () {
  document.getElementById("computers-section").style.display = "block";
  document.getElementById("find-device-section").style.display = "none";
});

document.getElementById("btn-find-device").addEventListener("click", function () {
  document.getElementById("computers-section").style.display = "none";
  document.getElementById("find-device-section").style.display = "block";
});
