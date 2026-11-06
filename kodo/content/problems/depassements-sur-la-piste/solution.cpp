#include <iostream>
#include <vector>
using namespace std;

int n;
vector<int> arbre;  // arbre de Fenwick sur les dossards : compte les dossards déjà arrivés

int somme(int i) {  // nombre de dossards déjà arrivés parmi 1..i
    int s = 0;
    for (; i > 0; i -= i & -i) s += arbre[i];
    return s;
}

void ajoute(int i) {  // le dossard i vient d'arriver
    for (; i <= n; i += i & -i) arbre[i] += 1;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin >> n;
    arbre.assign(n + 1, 0);
    long long total = 0;
    for (int i = 0; i < n; i++) {
        int d;
        cin >> d;
        // i skieurs sont déjà arrivés ; ceux de dossard > d ont dépassé d.
        total += i - somme(d);
        ajoute(d);
    }
    cout << total << "\n";
    return 0;
}
