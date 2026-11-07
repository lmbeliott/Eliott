#include <cstdio>
#include <iostream>
using namespace std;

int main() {
    long long p, t;
    cin >> p >> t;
    long long a = p * (100 + t);           // prix exact × 100, en centimes
    long long c = (2 * a + 100) / 200;     // arrondi au centime, moitié vers le haut
    printf("%.2f\n", (double) c / 100);
    return 0;
}
