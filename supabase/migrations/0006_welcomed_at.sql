-- When the welcome letter, with the journal code in it, last went to this
-- address.
--
-- Before this column the letter was sent only to an address that had never
-- been seen, which meant a reader who lost the code and subscribed again got
-- silence. Now the send is recorded, and the same address can be written to
-- again after a short cooling-off period: long enough that nobody can use
-- the subscribe box to fill a stranger's inbox, short enough that asking
-- twice works.
--
-- Existing rows are left null: they will be written to once, which is the
-- right answer for anyone who subscribed before this and never got a letter.

alter table subscribers add column if not exists welcomed_at timestamptz;
