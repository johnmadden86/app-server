fs.writeFile('input.json', JSON.stringify(teams), err => {
  if (err) {
    throw err;
  }
  console.log('complete');
});
