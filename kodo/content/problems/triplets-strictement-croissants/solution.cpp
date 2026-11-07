#include <algorithm>
#include <iostream>
#include <vector>
using namespace std;

int k;
vector<int> arbre;

void ajoute(int x) {
    for (; x <= k; x += x & -x) arbre[x]++;
}

// Nombre de valeurs déjà insérées de rang <= x.
int compte(int x) {
    int s = 0;
    for (; x > 0; x -= x & -x) s += arbre[x];
    return s;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> a(n);
    for (int& v : a) cin >> v;

    // Compression : chaque valeur est remplacée par son rang (1, 2, 3…) parmi les valeurs distinctes.
    vector<int> valeurs = a;
    sort(valeurs.begin(), valeurs.end());
    valeurs.erase(unique(valeurs.begin(), valeurs.end()), valeurs.end());
    k = valeurs.size();
    vector<int> r(n);
    for (int i = 0; i < n; i++) r[i] = lower_bound(valeurs.begin(), valeurs.end(), a[i]) - valeurs.begin() + 1;

    // plusPetitsAGauche[j] = nombre de i < j avec a[i] < a[j].
    vector<long long> plusPetitsAGauche(n);
    arbre.assign(k + 1, 0);
    for (int j = 0; j < n; j++) {
        plusPetitsAGauche[j] = compte(r[j] - 1);
        ajoute(r[j]);
    }

    // Même chose de droite à gauche : nombre de k > j avec a[k] > a[j].
    arbre.assign(k + 1, 0);
    long long total = 0;
    for (int j = n - 1; j >= 0; j--) {
        long long plusGrandsADroite = (n - 1 - j) - compte(r[j]);
        total += plusPetitsAGauche[j] * plusGrandsADroite;
        ajoute(r[j]);
    }
    cout << total << "\n";
    return 0;
}
