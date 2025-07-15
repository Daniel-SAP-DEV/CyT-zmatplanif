using material from '../db/schema';

service CatalogService {
    entity Material as projection on material.Material;
}
