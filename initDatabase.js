import pool from './db.js';


export default async function initDatabase() {
    const initSql = `
CREATE TABLE if not exists users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(10),
    family_id INT,
    create_at TIMESTAMP DEFAULT NOW(),
    avatar_url VARCHAR(255)
);

CREATE TABLE if not exists families (
    family_id SERIAL PRIMARY KEY,
    owner_id INT,
    family_name TEXT,
    create_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE if not exists invitations (
    id SERIAL PRIMARY KEY,
    family_id INT NOT NULL,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined')) NOT NULL,
    create_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE if not exists blacklist (
    id SERIAL PRIMARY KEY,
    url TEXT,
    added_by INT NOT NULL,
    family_id INT NOT NULL,
    create_at TIMESTAMP DEFAULT NOW()
);


do $$ 
begin 
	if not exists (
	select 1 
	from pg_constraint
	where conname = 'fk_users_family_id'
	) then 
		alter table users add constraint fk_users_family_id foreign key (family_id) references families (family_id);
	end if;
end
$$;

do $$ 
begin 
	if not exists (
	select 1 
	from pg_constraint
	where conname = 'fk_users_family_id'
	) then 
		alter table users add constraint fk_users_family_id foreign key (family_id) references familes (family_id);
	end if;
end
$$;


do $$ 
begin 
	if not exists (
	select 1 
	from pg_constraint
	where conname = 'fk_familes_owner_id'
	) then 
		alter table families add constraint fk_familes_owner_id foreign key (owner_id) references users (user_id);
	end if;
end
$$;

do $$ 
begin 
	if not exists (
	select 1 
	from pg_constraint
	where conname = 'fk_invitations_family_id'
	) then 
		ALTER TABLE invitations ADD CONSTRAINT fk_invitations_family_id FOREIGN KEY (family_id) REFERENCES families(family_id);
	end if;
end
$$;


do $$ 
begin 
	if not exists (
	select 1 
	from pg_constraint
	where conname = 'fk_invitations_sender_id'
	) then 
		ALTER TABLE invitations ADD CONSTRAINT fk_invitations_sender_id FOREIGN KEY (sender_id) REFERENCES users(user_id);
	end if;
end
$$;

do $$ 
begin 
	if not exists (
	select 1 
	from pg_constraint
	where conname = 'fk_invitations_recipient_id'
	) then 
		ALTER TABLE invitations ADD CONSTRAINT fk_invitations_recipient_id FOREIGN KEY (recipient_id) REFERENCES users(user_id);
	end if;
end
$$;

do $$ 
begin 
	if not exists (
	select 1 
	from pg_constraint
	where conname = 'fk_blacklist_added_by'
	) then 
		ALTER TABLE blacklist ADD CONSTRAINT fk_blacklist_added_by FOREIGN KEY (added_by) REFERENCES users(user_id);
	end if;
end
$$;

do $$
begin 
	if not exists (
	select 1
	from pg_constraint
	where conname = 'fk_blacklist_family_id'
	) then 
		ALTER TABLE blacklist ADD CONSTRAINT fk_blacklist_family_id FOREIGN KEY (family_id) REFERENCES families(family_id);
	end if;
end
$$;
`;

    try {
        await pool.query(initSql);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initialized successfully', err);
    }
}