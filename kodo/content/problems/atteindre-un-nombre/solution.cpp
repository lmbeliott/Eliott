#include <iostream>
using namespace std;

int main() {
    int a, b, k;
    cin >> a >> b >> k;

    // On part de B et on remonte vers A en défaisant les opérations :
    // « diviser par K » défait « multiplier par K », « retirer 1 » défait « ajouter 1 ».
    int etapes = 0;
    while (b > a) {
        if (b / k < a) {
            // Plus aucune division possible : il ne reste que des « ajouter 1 ».
            etapes = etapes + (b - a);
            b = a;
        } else if (b % k == 0) {
            // B est un multiple de K : diviser est toujours le meilleur choix.
            b = b / k;
            etapes = etapes + 1;
        } else {
            // B n'est pas un multiple de K : la dernière opération était forcément +1.
            b = b - 1;
            etapes = etapes + 1;
        }
    }

    cout << etapes << "\n";
    return 0;
}
