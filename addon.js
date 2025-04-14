async function handleVote(columnName) {
  const votedFacts = JSON.parse(localStorage.getItem("votedFacts")) || [];

  // Prevent voting again
  if (votedFacts.includes(fact.id)) {
    alert("You already voted on this fact!");
    return;
  }

  setIsUpdating(true);

  const { data: updatedFact, error } = await supabase
    .from("facts")
    .update({ [columnName]: fact[columnName] + 1 })
    .eq("id", fact.id)
    .select();

  setIsUpdating(false);

  if (!error) {
    setFacts((facts) =>
      facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
    );

    // Save voted fact ID
    localStorage.setItem(
      "votedFacts",
      JSON.stringify([...votedFacts, fact.id])
    );
  }
}

query = query.order("like", { ascending: false });
const { data: facts, error } = await query;

if (!error) {
  // Sort by popularity score (like + love - dislike)
  const sortedFacts = facts.sort(
    (a, b) => b.like + b.love - b.dislike - (a.like + a.love - a.dislike)
  );
  setFacts(sortedFacts);
} else {
  alert("There was a problem getting data");
}
