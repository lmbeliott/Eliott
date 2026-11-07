#include <iostream>
using namespace std;

int main() {
    int n;
    cin >> n;
    int articles = 0;
    int montant = 0;
    for (int i = 0; i < n; i++) {
        int q, p;
        cin >> q >> p;
        articles = articles + q;
        montant = montant + q * p;
    }
    cout << articles << "\n";
    cout << montant << "\n";
    return 0;
}
