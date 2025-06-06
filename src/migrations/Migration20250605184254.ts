import { Migration } from '@mikro-orm/migrations';

export class Migration20250605184254 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "ledger_account" ("id" varchar(255) not null default 'LEDGER_MASTER', "name" varchar(255) not null default 'Master Ledger', "balance" int not null default 0, "created_at" timestamptz not null, constraint "ledger_account_pkey" primary key ("id"));`);

    this.addSql(`create table "transaction" ("id" varchar(255) not null, "type" varchar(255) not null, "from_account_id" varchar(255) not null, "to_account_id" varchar(255) null, "amount" int not null, "fees" int not null, "description" varchar(255) not null, "timestamp" timestamptz not null, "status" varchar(255) not null default 'pending', constraint "transaction_pkey" primary key ("id"));`);

    this.addSql(`create table "wallet_owner" ("id" serial primary key, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "phone_number" varchar(255) not null, "date_of_birth" varchar(255) not null, "national_id" varchar(255) null);`);
    this.addSql(`alter table "wallet_owner" add constraint "wallet_owner_phone_number_unique" unique ("phone_number");`);

    this.addSql(`create table "wallet" ("id" varchar(255) not null, "owner_id" int not null, "balance" int not null default 0, "pin" varchar(255) not null, "created_at" timestamptz not null, "last_activity" timestamptz not null, constraint "wallet_pkey" primary key ("id"));`);
    this.addSql(`alter table "wallet" add constraint "wallet_owner_id_unique" unique ("owner_id");`);

    this.addSql(`alter table "wallet" add constraint "wallet_owner_id_foreign" foreign key ("owner_id") references "wallet_owner" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "wallet" drop constraint "wallet_owner_id_foreign";`);

    this.addSql(`drop table if exists "ledger_account" cascade;`);

    this.addSql(`drop table if exists "transaction" cascade;`);

    this.addSql(`drop table if exists "wallet_owner" cascade;`);

    this.addSql(`drop table if exists "wallet" cascade;`);
  }

}
