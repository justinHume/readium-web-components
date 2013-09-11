function next(elem) { do { elem = elem.nextSibling; } while (elem && elem.nodeType != 1); return elem; } function toggleProof(obj) { var elem = next(obj); if (elem.style.display == "none") { elem.style.display = "block"; } else { elem.style.display = "none"; } }

var proofDisplay = "block";

function toggleProofs(ctrl) { if (proofDisplay == "none") { proofDisplay = "block"; ctrl.innerHTML = "(Hide all proofs.)"; } else { proofDisplay = "none"; ctrl.innerHTML = "(Show all proofs.)"; } var proofs = document.getElementsByClassName('proof'); var body; for (var i=0; i<proofs.length; i++) { body = proofs[i].getElementsByClassName('body'); body[0].style.display = proofDisplay; } }

function OldtoggleProofs() { var proof = getCSSRule('.proof .body'); if (!proof) { proof = addCSSRule('.proof .body'); } if (proof.style.display == 'none') { proof.style.display = 'block'; } else { proof.style.display = 'none'; } }