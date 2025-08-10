app.post('/family/:id/block-website', async (req, res) => {
  const { url } = req.body;
  const familyId = req.params.id;
  const userId = req.user.id; // สมมุติมี auth หรือ mock id

  await db.query(
    'INSERT INTO BlockedWebsite (url, added_by, family_id) VALUES ($1, $2, $3)',
    [url, userId, familyId]
  );

  res.json({ success: true });
});

app.get('/family/:id/blocked-websites', async (req, res) => {
  const familyId = req.params.id;
  const result = await db.query('SELECT * FROM BlockedWebsite WHERE family_id = $1', [familyId]);
  res.json(result.rows);
});
