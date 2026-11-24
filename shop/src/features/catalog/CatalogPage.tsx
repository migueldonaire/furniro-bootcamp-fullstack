import { ProductCard } from "./ProductCard";
import styles from "./ProductCard.module.css"


// Replace this content with your card. Keep the title of the component.
export function CatalogPage() {
  return (
    <section className={styles.cardContainer}>
      <ProductCard imgURL= "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cojin-coral-1.jpg" title ="Cojín de Coral" description="cojín de coral para habitación" price="15$"></ProductCard>
      <ProductCard imgURL= "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cojin-coral-1.jpg" title ="Cojín de Coral" description="cojín de coral para habitación" price="15$"></ProductCard>
      <ProductCard imgURL= "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cojin-coral-1.jpg" title ="Cojín de Coral" description="cojín de coral para habitación" price="15$"></ProductCard>
      <ProductCard imgURL= "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cojin-coral-1.jpg" title ="Cojín de Coral" description="cojín de coral para habitación" price="15$"></ProductCard>
      <ProductCard imgURL= "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cojin-coral-1.jpg" title ="Cojín de Coral" description="cojín de coral para habitación" price="15$"></ProductCard>
      <ProductCard imgURL= "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cojin-coral-1.jpg" title ="Cojín de Coral" description="cojín de coral para habitación" price="15$"></ProductCard>
      <ProductCard imgURL= "https://raw.githubusercontent.com/migueldonaire/furniro-bootcamp-fullstack/main/database/images/cojin-coral-1.jpg" title ="Cojín de Coral" description="cojín de coral para habitación" price="15$"></ProductCard>
      <ProductCard imgURL= "" title ="Cojín de Coral" description="cojín de coral para habitación" price="15"></ProductCard>
    </section>
  );
}
