CREATE TABLE if not exists users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(255),
    password VARCHAR(255),
    phone VARCHAR(10) UNIQUE,
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


CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) CHECK (type IN ('private', 'group')) NOT NULL,
    family_id INTEGER,
    name VARCHAR(255),
    create_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (family_id) REFERENCES familes(family_id) ON DELETE CASCADE
)

-- CREATE TABLE chat_participatns (
--     id SERIAL PRIMARY KEY,
--     room_id INTEGER 
-- );

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES chat_rooms(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);