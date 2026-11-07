#include <iostream>
#include <vector>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> t(n);
    for (int i = 0; i < n; i++) cin >> t[i];

    long long courant = t[0];   // meilleur total d'une période qui finit au jour courant
    int debut = 0;              // premier jour de cette période (indice)
    long long meilleur = t[0];
    int meilleurDebut = 0, meilleurFin = 0;
    for (int i = 1; i < n; i++) {
        if (courant >= 0) {
            courant = courant + t[i];   // prolonger la période
        } else {
            courant = t[i];             // repartir de zéro
            debut = i;
        }
        if (courant > meilleur) {       // strict : on garde la première trouvée
            meilleur = courant;
            meilleurDebut = debut;
            meilleurFin = i;
        }
    }
    cout << meilleur << " " << meilleurDebut + 1 << " " << meilleurFin + 1 << "\n";
    return 0;
}
