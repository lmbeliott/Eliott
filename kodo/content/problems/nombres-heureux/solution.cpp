#include <iostream>
#include <vector>
using namespace std;

long long suivant(long long n) {
    long long s = 0;
    while (n > 0) {
        long long c = n % 10;
        s = s + c * c;
        n = n / 10;
    }
    return s;
}

int etapes(long long n) {
    // Après une étape, toutes les valeurs sont < 1500.
    vector<bool> vu(1500, false);   // tableau local : recréé à chaque appel
    int k = 0;
    while (n != 1) {
        if (n < 1500) {
            if (vu[n]) {
                return -1;          // valeur déjà vue : la suite tourne en rond
            }
            vu[n] = true;
        }
        n = suivant(n);
        k = k + 1;
    }
    return k;
}

int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        cin >> n;
        cout << etapes(n) << "\n";
    }
    return 0;
}
