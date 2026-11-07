#include <algorithm>
#include <climits>
#include <iostream>
#include <set>
#include <vector>
using namespace std;

long long cible, meilleur;
set<vector<long long>> deja_vus;        // multiensembles déjà explorés

void explorer(vector<long long> liste) {
    vector<long long> cle = liste;
    sort(cle.begin(), cle.end());
    if (meilleur == 0 || deja_vus.count(cle)) return;
    deja_vus.insert(cle);
    int k = liste.size();
    for (int i = 0; i < k; i++) {
        for (int j = i + 1; j < k; j++) {
            long long a = max(liste[i], liste[j]), b = min(liste[i], liste[j]);
            vector<long long> reste;
            for (int t = 0; t < k; t++)
                if (t != i && t != j) reste.push_back(liste[t]);
            vector<long long> resultats = {a + b, a * b};
            if (a > b) resultats.push_back(a - b);
            if (a % b == 0) resultats.push_back(a / b);
            for (long long v : resultats) {
                meilleur = min(meilleur, v > cible ? v - cible : cible - v);
                reste.push_back(v);
                explorer(reste);
                reste.pop_back();
            }
        }
    }
}

int main() {
    int n;
    cin >> n >> cible;
    vector<long long> nombres(n);
    for (int i = 0; i < n; i++) cin >> nombres[i];
    meilleur = LLONG_MAX;
    for (long long x : nombres) meilleur = min(meilleur, x > cible ? x - cible : cible - x);
    explorer(nombres);
    cout << meilleur << "\n";
    return 0;
}
