# PBI: Как клиент, я хочу отслеживать статус заказа

- **Тип:** PBI (User Story)
- **Part of:** Feature «Оформление заказа» (#7)
- **Спринт:** Sprint 3 (запланирован)
- **Оценка:** 3 SP · **Приоритет:** 3

## User story

> Как клиент, я хочу видеть статус заказа (`Pending / Shipped / Completed`),
> чтобы планировать получение.

## Условия приёмки

- [ ] Личный кабинет показывает список заказов с датой и суммой
- [ ] Статус отображается по-русски, маппинг — в `OrderStatusView`
- [ ] Отменённые (`Cancelled`) заказы видны отдельным фильтром

## Проверка на тестовых данных

```sql
SELECT Status, COUNT(*) AS Cnt, SUM(TotalAmount) AS Amount
FROM Orders
GROUP BY Status;
```

Ожидаемые статусы: `Completed`, `Shipped`, `Pending`, `Cancelled`.
