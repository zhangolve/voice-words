n=30
every_year_pay = 4600
total_interest = 1.08
total_count = 0;

for i in range(1, n+1):
    total_count += every_year_pay * 1.03 ** i

print(total_count, every_year_pay* n)