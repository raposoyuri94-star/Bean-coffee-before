import { menuCategories, orderCatalog } from '../data/menu'
import { formatMoney } from '../order'
import type { MenuProduct, OrderQuantities } from '../order'
import QuantityControl from '../QuantityControl'
import { useMenuCarousel } from './useMenuCarousel'
import './MenuSection.css'

function MenuItems({
  items,
  quantities,
  onQuantityChange,
}: {
  items: MenuProduct[]
  quantities: OrderQuantities
  onQuantityChange: (id: string, quantity: number) => void
}) {
  return (
    <div className="menu-list">
      {items.length ? (
        items.map((item, i) => {
          const id = item.id
          return (
            <article className="menu-item" key={id}>
              <span className="item-number">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h5>{item.name}</h5>
                {item.description && <p>{item.description}</p>}
              </div>
              <div className="menu-item-order">
                <strong>{formatMoney(item.price)}</strong>
                <QuantityControl
                  name={orderCatalog.get(id)?.orderName ?? item.name}
                  quantity={quantities[id] ?? 0}
                  onChange={(quantity) => onQuantityChange(id, quantity)}
                />
              </div>
            </article>
          )
        })
      ) : (
        <p className="menu-category-empty">Novidades em breve.</p>
      )}
    </div>
  )
}

export default function MenuSection({
  quantities,
  onQuantityChange,
  count,
  onStartOrder,
}: {
  quantities: OrderQuantities
  onQuantityChange: (id: string, quantity: number) => void
  count: number
  onStartOrder: () => void
}) {
  const { menuRef, activeCategory, slideMenu, events } = useMenuCarousel(menuCategories.length)
  return (
    <section className="menu-section" aria-labelledby="menu-title">
      <div className="menu-heading">
        <div>
          <p className="section-tag light">O nosso menu</p>
          <h2 id="menu-title">
            Menu enxuto.
            <br />
            <em>Grande personalidade.</em>
          </h2>
        </div>
        <p>Favoritos da casa feitos com grãos cuidadosamente torrados e ingredientes que amamos.</p>
      </div>
      <div className="menu-category-controls" id="menu" role="group" aria-label="Categorias do menu">
        {menuCategories.map((category, index) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={activeCategory === index}
            aria-controls={'menu-' + category.id}
            onClick={() => slideMenu(index)}
          >
            {category.name}
          </button>
        ))}
      </div>
      <p className="menu-category-hint" id="menu-category-hint">
        Escolha uma categoria ou deslize. Adicione os seus favoritos ao pedido.
      </p>
      <div
        className="menu-categories"
        ref={menuRef}
        role="region"
        aria-label="Secções do menu"
        tabIndex={0}
        aria-describedby="menu-category-hint"
        {...events}
      >
        {menuCategories.map((category, index) => (
          <section
            className="menu-category"
            data-active={activeCategory === index}
            aria-hidden={activeCategory !== index}
            inert={activeCategory !== index}
            id={'menu-' + category.id}
            key={category.id}
            aria-labelledby={'heading-' + category.id}
          >
            <h3 className="menu-category-title" id={'heading-' + category.id}>
              {category.name}
            </h3>
            {category.groups ? (
              category.groups.map((group, index) => (
                <section
                  className="menu-subcategory"
                  key={group.name}
                  aria-labelledby={category.id + '-group-' + index}
                >
                  <h4 className="menu-subcategory-title" id={category.id + '-group-' + index}>
                    {group.name}
                  </h4>
                  <MenuItems
                    items={group.items}
                    quantities={quantities}
                    onQuantityChange={onQuantityChange}
                  />
                </section>
              ))
            ) : (
              <MenuItems
                items={category.items ?? []}
                quantities={quantities}
                onQuantityChange={onQuantityChange}
              />
            )}
          </section>
        ))}
      </div>
      <aside className="menu-notes" aria-labelledby="menu-notes-title">
        <h3 id="menu-notes-title">À sua medida</h3>
        <div className="menu-notes-content">
          <p>
            Alguns dos nossos pratos contêm ervas aromáticas, cebolinha, pimenta ou cebola roxa.{' '}
            <strong>Tem alguma alergia ou prefere evitar algum ingrediente?</strong> Por favor, informe o
            empregado de mesa antes de pedir.
          </p>
          <p className="menu-notes-extras">
            <span>Extras</span> Consulte os preços com o empregado de mesa antes de pedir.
          </p>
        </div>
      </aside>
      <button
        id="start-order"
        className="button button-gold order-start"
        type="button"
        onClick={onStartOrder}
      >
        {count ? 'Rever o pedido' : 'Fazer pedido'}
      </button>
    </section>
  )
}
