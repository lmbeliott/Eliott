#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int m;
vector<int> arbre;

void ajoute(int i) {  // une valeur de plus dans la case i
    for (; i <= m; i += i & -i) arbre[i]++;
}

int somme(int i) {  // nombre de valeurs déjà vues dans les cases 1 à i
    int s = 0;
    for (; i > 0; i -= i & -i) s += arbre[i];
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    long long bas, haut;
    cin >> n >> bas >> haut;
    vector<long long> a(n);
    for (long long& x : a) cin >> x;

    // Compression : la valeur valeurs[k] correspond à la case k + 1 de l'arbre de Fenwick.
    vector<long long> valeurs = a;
    sort(valeurs.begin(), valeurs.end());
    valeurs.erase(unique(valeurs.begin(), valeurs.end()), valeurs.end());
    m = valeurs.size();
    arbre.assign(m + 1, 0);

    long long total = 0;
    for (long long x : a) {
        // Les a[i] déjà vus qui conviennent sont ceux de [x - haut, x - bas].
        int debut = lower_bound(valeurs.begin(), valeurs.end(), x - haut) - valeurs.begin();
        int fin = upper_bound(valeurs.begin(), valeurs.end(), x - bas) - valeurs.begin();
        if (fin > debut) total += somme(fin) - somme(debut);
        ajoute(lower_bound(valeurs.begin(), valeurs.end(), x) - valeurs.begin() + 1);
    }
    cout << total << "\n";
    return 0;
}
