#include <iostream>
#include <vector>
using namespace std;

int n;
vector<long long> a;

// nombre de portions de somme <= s, avec deux pointeurs
long long nombre_au_plus(long long s) {
    long long total = 0, somme = 0;
    int debut = 0;
    for (int fin = 0; fin < n; fin++) {
        somme += a[fin];
        while (somme > s) {
            somme -= a[debut];
            debut++;
        }
        total += fin - debut + 1;   // portions qui finissent en fin
    }
    return total;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long k;
    cin >> n >> k;
    a.resize(n);
    long long somme_totale = 0;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        somme_totale += a[i];
    }

    long long trop_petit = 0;            // aucune portion n'a une somme <= 0
    long long suffisant = somme_totale;  // toutes les portions ont une somme <= somme_totale
    while (suffisant - trop_petit > 1) {
        long long milieu = (trop_petit + suffisant) / 2;
        if (nombre_au_plus(milieu) >= k) suffisant = milieu;
        else trop_petit = milieu;
    }
    cout << suffisant << "\n";
    return 0;
}
