using material from '../db/schema';

service CatalogService {
    entity Planing as projection on material.Planing;
}
