#include <iostream>
using namespace std;

// produit des chiffres de n
long long produit(long long n) {
    if (n < 10) {
        return n;
    }
    return (n % 10) * produit(n / 10);
}

int persistance(long long n) {
    if (n < 10) {
        return 0;
    }
    return 1 + persistance(produit(n));
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        cin >> n;
        cout << persistance(n) << "\n";
    }
    return 0;
}
